FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY MedLib.slnx ./
COPY src/MedLib.Api/MedLib.Api.csproj ./src/MedLib.Api/
RUN dotnet restore MedLib.slnx

COPY src/MedLib.Api/ ./src/MedLib.Api/
RUN dotnet publish src/MedLib.Api/MedLib.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_HTTP_PORTS=8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "MedLib.Api.dll"]
