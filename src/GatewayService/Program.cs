using Microsoft.AspNetCore.Authentication.JwtBearer;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

// gateway service is able to terminate jwt
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.Authority = builder.Configuration["IdentityService:Authority"];
        opt.RequireHttpsMetadata = false;
        opt.TokenValidationParameters.ValidateAudience = false;
        opt.TokenValidationParameters.NameClaimType = "username";
    });

builder.Services.AddCors(opt =>
{
    opt.AddPolicy("customPolicy", p =>
    {
        p.AllowAnyHeader();
        p.AllowAnyMethod();
        p.AllowCredentials();
        p.WithOrigins(builder.Configuration["ClientApp"]!);
    });
});

var app = builder.Build();


app.UseCors();

app.MapReverseProxy();

app.UseAuthentication();
app.UseAuthorization();

app.Run();
