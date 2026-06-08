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
    public class BudgetConfiguration: IEntityTypeConfiguration<Budget>
    {
        public void Configure(EntityTypeBuilder<Budget> builder)
        {
            builder.Property(p => p.MonthlyLimit)
                .HasColumnType("decimal(10,2)")
                .IsRequired();
            builder.Property(p => p.UserEmail)
                    .IsRequired();
            builder.Property(p => p.BudgetMonth)
                     .IsRequired();
        }
    }
}
