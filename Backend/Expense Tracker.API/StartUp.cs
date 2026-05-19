using Expense_Tracker.BLL.IServices;
using Expense_Tracker.BLL.Services;
using Expense_Tracker.DAL;
using Expense_Tracker.DAL.Entities;
using Expense_Tracker.DAL.IRepositories;
using Expense_Tracker.DAL.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.SqlServer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using System;
using System.Data;
using System.Text;
using System.Text.Json.Serialization;

namespace Expense_Tracker.API
{
    public class StartUp
    {

        public string SpecificOrigins = "_allowSpecificOrigins";
        public StartUp(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddCors(options =>
            {
                options.AddPolicy(name: SpecificOrigins,
                                  builder =>
                                  {
                                      builder.WithOrigins("localhost:4200", "http://localhost:4200").AllowAnyMethod().AllowAnyHeader();
                                  });
            });

            //referinta circulara in cazul relatiei 1:1
            //ii spunem ce sa faca cand avem un loop de referinte: il ignora
            services.AddControllers()
                .AddNewtonsoftJson(option => option.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);


            //aplicatia stie ca folosim un context cu acea baza de date, la rulare va putea sa foloseasca direct baza de date
            //trebuie sa injectam 
            //optioni: ii spun ce fel de provider avem => el trebuie sa se duca catre un sql server si sa faca o conexiune cu un sql server
            services.AddDbContext<AppDbContext>(options => options.UseSqlServer(Configuration.GetConnectionString("ConnString"),
        b => b.MigrationsAssembly("Expense Tracker.DAL")));
            //acum avem baza de date legata la aplicatia noastra

            //transient creeaza o noua instanta cand se doreste o injectare
            services.AddTransient<ICategoryRepository, CategoryRepository>();
            services.AddTransient<ICategoryService, CategoryService>();

            services.AddTransient<IExpenseRepository, ExpenseRepository>();
            services.AddTransient<IExpenseService, ExpenseService>();

            services.AddTransient<IBudgetRepository, BudgetRepository>();
            services.AddTransient<IBudgetService, BudgetService>();

            services.AddTransient<IUserService, UserService>();
            services.AddTransient<ITokenHelper, TokenHelper>();

            services.AddHttpClient<GeminiService>();

            services.AddControllers().AddJsonOptions(x =>
               x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve); //pentru a afisa frumos fara a face modele


            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Expense Tracker", Version = "v1" });
            });

            // identity
            services.AddIdentity<User, Role>()
                .AddEntityFrameworkStores<AppDbContext>()
                .AddDefaultTokenProviders();   //se va folosi providerul de la .NET

            services
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer("AuthScheme", options =>
                {
                    options.RequireHttpsMetadata = true;  //o sa trebuiasca sa fie un required Https
                    options.SaveToken = true;
                    var secret = Configuration.GetSection("Jwt").GetSection("Token").Get<String>();  //ia secretul ca si string => se foloseste la crearea AccesToken
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        ValidateLifetime = true,
                        RequireExpirationTime = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                    options.Events = new JwtBearerEvents
                    {
                        OnAuthenticationFailed = context =>
                        {
                            if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
                            {
                                context.Response.Headers.Add("Token-Expired", "true");
                            }
                            return Task.CompletedTask;
                        }
                    };
                });

            //Autentificarea se face pe baza acestori roluri roluri => trebuie adaugate si in baza de date
            services.AddAuthorization(opt =>
            {
                opt.AddPolicy("Admin", policy => policy.RequireRole("Admin").RequireAuthenticatedUser().AddAuthenticationSchemes("AuthScheme").Build());
                opt.AddPolicy("User", policy => policy.RequireRole("User").RequireAuthenticatedUser().AddAuthenticationSchemes("AuthScheme").Build());
            });

            services.AddTransient<InitialSeed>();    
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, InitialSeed initialSeed)  //spun si aici ca ii ofer un serviciu
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Expense Tracker v1");
                });
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors(SpecificOrigins);
           

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            initialSeed.CreateRoles();      //daca aceste roluri exista, la urmatorul run nu le va mai crea
        }
    }
    }
