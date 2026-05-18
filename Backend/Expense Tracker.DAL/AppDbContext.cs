using Expense_Tracker.DAL.Entities;
using Expense_Tracker.DAL.EntitiesConfiguration;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Expense_Tracker.DAL
{
    public class AppDbContext 
        
        : IdentityDbContext<
        User,
        Role,
        int,
        IdentityUserClaim<int>,
        UserRole,
        IdentityUserLogin<int>,
        IdentityRoleClaim<int>,
        IdentityUserToken<int>>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)  //constructor
        {

        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //cand vom porni aplicatia i se va deschide o consola si ne va scrie el in consola ce queryuri face baza de date
            //optionsBuilder.UseLoggerFactory(LoggerFactory.Create(builder => builder.AddConsole()));
        }

        //public DbSet<Book> Books { get; set; }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Budget> Budgets { get; set; }
        public DbSet<Expense> Expenses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)   //aici trec constrangerile, configuratiile
        {
            base.OnModelCreating(modelBuilder);

            //modelBuilder.ApplyConfiguration(new BookConfiguration());

            modelBuilder.ApplyConfiguration(new CategoryConfiguration());
            modelBuilder.ApplyConfiguration(new BudgetConfiguration());
            modelBuilder.ApplyConfiguration(new ExpenseConfiguration());

            // Explicitly configure Identity join entity to avoid shadow FK creation
            modelBuilder.Entity<UserRole>(ur =>
            {
                ur.HasKey(x => new { x.UserId, x.RoleId });

                ur.HasOne(x => x.User)
                  .WithMany(u => u.UserRoles)
                  .HasForeignKey(x => x.UserId)
                  .IsRequired();

                ur.HasOne(x => x.Role)
                  .WithMany(r => r.UserRoles)
                  .HasForeignKey(x => x.RoleId)
                  .IsRequired();
            });

        }
    }
    }
