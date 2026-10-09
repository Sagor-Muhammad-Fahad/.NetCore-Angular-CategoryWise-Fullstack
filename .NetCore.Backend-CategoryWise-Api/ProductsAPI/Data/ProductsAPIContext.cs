using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ProductsAPI.Models;

namespace ProductsAPI.Data
{
    public class ProductsAPIContext : IdentityDbContext<ApiUser>
    {
        private readonly IConfiguration _configuration;

        public ProductsAPIContext (DbContextOptions<ProductsAPIContext> options, IConfiguration configuration)
            : base(options)
        {
            _configuration = configuration;
        }

        public DbSet<Category> Categories { get; set; } = default!;
        public DbSet<Model> Models { get; set; } = default!;
        public DbSet<Product> Products {  get; set; } = default!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) => optionsBuilder.UseSqlServer(_configuration.GetConnectionString("DefaultConnection"));
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Model>().HasData(new Model[]
            {
                new Model
                {
                    ModelId = 1,
                    Name = "Classic Vest"
                },
                new Model
                {
                    ModelId = 2,
                    Name = "Cycling Cap"
                },
                new Model
                {
                    ModelId = 3,
                    Name = "Full-Finger Gloves"
                },
                new Model
                {
                    ModelId = 4,
                    Name = "Half-Finger Gloves"
                },
                new Model
                {
                    ModelId = 5,
                    Name = "HL Mountain Frame"
                },
                new Model
                {
                    ModelId = 6,
                    Name = "HL Road Frame"
                },
                new Model
                {
                    ModelId = 7,
                    Name = "HL Touring Frame"
                },
                new Model
                {
                    ModelId = 8,
                    Name = "LL Mountain Frame"
                },
                new Model
                {
                    ModelId = 9,
                    Name = "LL Road Frame"
                },
                new Model
                {
                    ModelId = 10,
                    Name = "LL Touring Frame"
                },
                new Model
                {
                    ModelId = 11,
                    Name = "Long-Sleeve Logo Jersey"
                },
                new Model
                {
                    ModelId = 12,
                    Name = "Men's Bib-Shorts"
                },
                new Model
                {
                    ModelId = 13,
                    Name = "Men's Sports Shorts"
                },
                new Model
                {
                    ModelId = 14,
                    Name = "ML Mountain Frame"
                },
                new Model
                {
                    ModelId = 15,
                    Name = "ML Mountain Frame-W"
                },
                new Model
                {
                    ModelId = 16,
                    Name = "ML Road Frame"
                },
                new Model
                {
                    ModelId = 17,
                    Name = "ML Road Frame-W"
                },
                new Model
                {
                    ModelId = 18,
                    Name = "Mountain Bike Socks"
                },
                new Model
                {
                    ModelId = 19,
                    Name = "Mountain-100"
                },
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}
