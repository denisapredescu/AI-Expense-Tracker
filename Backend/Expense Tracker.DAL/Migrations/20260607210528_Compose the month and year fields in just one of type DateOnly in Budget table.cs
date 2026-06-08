using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Expense_Tracker.DAL.Migrations
{
    /// <inheritdoc />
    public partial class ComposethemonthandyearfieldsinjustoneoftypeDateOnlyinBudgettable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Month",
                table: "Budgets");

            migrationBuilder.DropColumn(
                name: "Year",
                table: "Budgets");

            migrationBuilder.AddColumn<DateOnly>(
                name: "BudgetMonth",
                table: "Budgets",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BudgetMonth",
                table: "Budgets");

            migrationBuilder.AddColumn<int>(
                name: "Month",
                table: "Budgets",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Year",
                table: "Budgets",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
