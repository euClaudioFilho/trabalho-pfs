using ConsultasOdontologicasAPI.Data;
using ConsultasOdontologicasAPI.Models;
using ConsultasOdontologicasAPI.Services;
using Microsoft.EntityFrameworkCore;

namespace ConsultasOdontologicasAPI.Endpoints;

public static class AuthEndpoints
{
    public static void AdicionarAuthEndpoints(this WebApplication app)
    {
        var grupo = app.MapGroup("/auth");

        grupo.MapPost("/register", RegistrarUsuarioAsync);
        grupo.MapPost("/login", LoginAsync);
    }

    private static async Task<IResult> RegistrarUsuarioAsync(AppDbContext db, Usuario usuario)
    {
        if (await db.Usuarios.AnyAsync(u => u.Email == usuario.Email))
            return TypedResults.BadRequest("Email já está cadastrado.");

        var rolesValidas = new[] { "Paciente", "Dentista", "Admin" };
        if (!rolesValidas.Contains(usuario.Role))
            return TypedResults.BadRequest("Role inválida. As roles permitidas são: Paciente, Dentista, Admin.");

        usuario.Senha = BCrypt.Net.BCrypt.HashPassword(usuario.Senha);

        db.Usuarios.Add(usuario);
        await db.SaveChangesAsync();

        return TypedResults.Created($"/auth/register/{usuario.Id}", new { usuario.Id, usuario.Nome, usuario.Email, usuario.Role });
    }

    private static async Task<IResult> LoginAsync(AppDbContext db, LoginRequest request)
    {
        Console.WriteLine($"Email recebido: {request.Email}");
        Console.WriteLine($"Senha recebida: {request.Senha}");

        var usuario = await db.Usuarios.FirstOrDefaultAsync(u => u.Email == request.Email);

        if (usuario == null || !BCrypt.Net.BCrypt.Verify(request.Senha, usuario.Senha))
        {
            Console.WriteLine("Usuário ou senha inválidos.");
            return TypedResults.BadRequest("Usuário ou senha inválidos.");
        }

        var token = TokenService.GenerateToken(usuario.Id, usuario.Role);

        Console.WriteLine($"Login bem-sucedido para usuário: {usuario.Email}");
        return TypedResults.Ok(new
        {
            token,
            nome = usuario.Nome,
            pacienteId = usuario.Role == "Paciente" ? (int?)usuario.Id : null,
            dentistaId = usuario.Role == "Dentista" ? (int?)usuario.Id : null
        });
    }
}
