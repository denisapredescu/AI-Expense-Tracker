using Expense_Tracker.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Expense_Tracker.DAL.EntitiesConfiguration
{
    public class ExpenseConfiguration : IEntityTypeConfiguration<Expense>
    {
        public void Configure(EntityTypeBuilder<Expense> builder)
        {
            builder.Property(p => p.Description)
                .HasColumnType("nvarchar(1000)");
             
            builder.Property(p => p.Amount)
                .HasColumnType("decimal(10,2)")
                .IsRequired();
            builder.Property(p => p.UserEmail)
                .IsRequired();

            builder.Property(p => p.PaymentDate)
                 .HasColumnType("nvarchar(100)")
                 .HasMaxLength(100);
        }
    }
}
