using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace ProductsAPI.Models
{
    [Table(nameof(Category))]
    public class Category
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CategoryID { get; set; }

        [Required, NotNull]
        public required string Name { get; set; }

        public ICollection<Product>? Products { get; set; }
    }
    [Table(nameof(Model))]
    public class Model
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ModelId { get; set; }

        [Required, MaxLength(50), NotNull]
        public required string Name { get; set; }

        public ICollection<Product>? Products { get; set; }
    }
    [Table(nameof(Product))]
    public class Product
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ProductID { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string ProductNumber { get; set; } = string.Empty;

        public string? Color { get; set; }

        [Required]
        public decimal StandardCost { get; set; }

        [Required]
        public decimal ListPrice { get; set; }

        [Required]
        public int Size { get; set; }

        public decimal Weight { get; set; }

        [NotMapped]
        public IFormFile? Image { get; set; }

        public string? ImagePath { get; set; }

        public DateTime ModifiedDate { get; set; } = DateTime.UtcNow;

        public int CategoryID { get; set; }

        [ForeignKey(nameof(CategoryID))]
        public Category? Category { get; set; }

        public int ModelId { get; set; }

        [ForeignKey(nameof(ModelId))]
        public Model? Model { get; set; }
    }
}
