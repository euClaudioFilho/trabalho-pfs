using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ConsultasOdontologicasAPI.Migrations
{
    /// <inheritdoc />
    public partial class UpdateConsultaTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Consultas",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Consultas");
        }
    }
}
