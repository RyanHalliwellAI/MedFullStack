using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder =>
        {
            builder.WithOrigins("http://localhost:3000")
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Apply CORS policy before other middlewares
app.UseCors("AllowFrontend");

app.UseHttpsRedirection(); // Redirect HTTP to HTTPS
app.UseStaticFiles(); // Serve static files (if any)

// Middleware for error handling in production
app.UseExceptionHandler("/Home/Error");
app.UseHsts(); // Use HTTP Strict Transport Security

app.UseAuthorization();

app.MapControllers();

app.Run();
