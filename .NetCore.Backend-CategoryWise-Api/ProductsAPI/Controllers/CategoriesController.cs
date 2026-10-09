using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductsAPI.Data;
using ProductsAPI.Models;
namespace ProductsAPI.Controllers{
    [Route("[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ProductsAPIContext _context;
        public CategoriesController(ProductsAPIContext context){
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategory()        
        
        
        {
            var list= await _context.Categories.Include(c => c.Products)
                .ThenInclude(p => p.Model).ToListAsync();
            return list;
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
            var category = await _context.Categories
        .Include(pc => pc.Products)
        .FirstOrDefaultAsync(pc => pc.CategoryID == id);

            if (category == null)
            {
                return NotFound();
            }

            return category;
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategory(int id, [FromForm] Category category)
        {
            if (id != category.CategoryID)
            {
                return BadRequest();
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var dbProducts = await _context.Products
                    .AsNoTracking()
                    .Where(p => p.CategoryID == id)
                    .ToListAsync();                
                if (category.Products != null)
                {
                    foreach (Product aProduct in category.Products)
                    {
                        if (aProduct.Image != null && aProduct.Image.Length > 0)
                        {                          
                            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
                            if (!Directory.Exists(uploadsFolder))
                            {
                                Directory.CreateDirectory(uploadsFolder);
                            }

                            var filePath = Path.Combine(uploadsFolder, aProduct.Image.FileName);
                            using (var stream = new FileStream(filePath, FileMode.Create))
                            {
                                await aProduct.Image.CopyToAsync(stream);
                            }
                            aProduct.ImagePath = "Uploads/" + aProduct.Image.FileName;
                        }
                        else if (aProduct.ProductID > 0)
                        {                         
                            var existingDbProduct = dbProducts.FirstOrDefault(p => p.ProductID == aProduct.ProductID);
                            if (existingDbProduct != null && string.IsNullOrEmpty(aProduct.ImagePath))
                            {
                                aProduct.ImagePath = existingDbProduct.ImagePath;
                            }
                        }
                        else if (string.IsNullOrEmpty(aProduct.ImagePath))
                        {                           
                            aProduct.ImagePath = "Uploads/images.png";
                        }
                    }
                }               
                var incomingProductIds = category.Products?
                    .Where(p => p.ProductID > 0)
                    .Select(p => p.ProductID)
                    .ToArray() ?? Array.Empty<int>();

                var existingProductIds = dbProducts.Select(p => p.ProductID).ToArray();
                var idsToRemove = existingProductIds.Except(incomingProductIds);

                foreach (int productId in idsToRemove)
                {
                    _context.Products.Remove(new Product { ProductID = productId });
                }
                _context.Update(category);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (Exception){
                await transaction.RollbackAsync();
                if (!ProductCategoryExists(id)){
                    return NotFound();
                }
                else {throw; }
            }

            return NoContent();
        }
        [HttpPost]
        public async Task<ActionResult<Category>> PostCategory([FromForm]Category category)
        {
            foreach (Product aProduct in category.Products!)
            {
                if (aProduct.Image != null && aProduct.Image.Length > 0)
                {
                    var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
                    var filePath = Path.Combine(uploadsFolder, aProduct.Image.FileName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await aProduct.Image.CopyToAsync(stream);
                    }
                    aProduct.ImagePath = "Uploads/" + aProduct.Image.FileName;
                }
                else
                {
                    aProduct.ImagePath = "Uploads/images.png";
                }
            }
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetCategory", new { id = category.CategoryID }, category);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id){
            var productCategory = await _context.Categories.FindAsync(id);
            if (productCategory == null){
                return NotFound();
            }
            _context.Categories.Remove(productCategory);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        [HttpGet("Models")]
        public async Task<ActionResult<IEnumerable<Model>>> GetModels(){
            return await _context.Models.ToListAsync();
        }
        private bool ProductCategoryExists(int id)
        {
            return _context.Categories.Any(e => e.CategoryID == id);
        }
    }
}
