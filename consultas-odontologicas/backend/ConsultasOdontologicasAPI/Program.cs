using ConsultasOdontologicasAPI.Data;
using ConsultasOdontologicasAPI.Endpoints;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ConsultasOdontologicasAPI.Models;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("123456789123456789123456789123456789")),
            ValidateIssuer = false,
            ValidateAudience = false,
        };
    });

builder.Services.AddAuthorizationBuilder()
    .AddPolicy("Admin", policy => policy.RequireRole("Admin"))
    .AddPolicy("Paciente", policy => policy.RequireRole("Paciente"))
    .AddPolicy("Dentista", policy => policy.RequireRole("Dentista"))
    .AddPolicy("AdminOuPaciente", policy => policy.RequireClaim(ClaimTypes.Role, "Admin", "Paciente"))
    .AddPolicy("DentistaOuAdmin", policy => policy.RequireClaim(ClaimTypes.Role, "Dentista", "Admin"));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.AdicionarAuthEndpoints();
app.AdicionarConsultaEndpoints();
app.AdicionarDentistaEndpoints();
app.AdicionarPacienteEndpoints();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await CriarAdminPadrao(db);
}

async Task CriarAdminPadrao(AppDbContext db)
{
    if (!await db.Usuarios.AnyAsync(u => u.Role == "Admin"))
    {
        var senhaPadrao = "admin123";
        var senhaHash = BCrypt.Net.BCrypt.HashPassword(senhaPadrao);

        var admin = new Usuario
        {
            Nome = "Administrador",
            Email = "admin@email.com",
            Senha = senhaHash,
            Role = "Admin"
        };

        db.Usuarios.Add(admin);
        await db.SaveChangesAsync();

        Console.WriteLine($"Admin padrão criado com sucesso. Email: {admin.Email}, Senha: {senhaPadrao}");
    }
    else
    {
        Console.WriteLine("Admin já existe. Nenhuma ação necessária.");
    }
}

app.Run();
