using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Expense_Tracker.DAL.Migrations
{
    /// <inheritdoc />
    public partial class ComposethemonthandyearfieldsinjustoneoftypedatetimeinBudgettable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "BudgetMonth",
                table: "Budgets",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateOnly),
                oldType: "date");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateOnly>(
                name: "BudgetMonth",
                table: "Budgets",
                type: "date",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");
        }
    }
}
