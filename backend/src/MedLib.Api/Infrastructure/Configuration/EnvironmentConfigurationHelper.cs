namespace MedLib.Api.Infrastructure.Configuration;

public static class EnvironmentConfigurationHelper
{
    public static string NormalizePostgresConnectionString(string connection)
    {
        if (connection.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase) ||
            connection.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase))
        {
            var uri = new Uri(connection);
            var userInfo = uri.UserInfo.Split(':');
            var username = userInfo.Length > 0 ? Uri.UnescapeDataString(userInfo[0]) : "";
            var password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : "";
            var database = uri.AbsolutePath.TrimStart('/');
            var port = uri.Port > 0 ? uri.Port : 5432;

            return $"Host={uri.Host};Port={port};Database={database};Username={username};Password={password};SSL Mode=Require;Trust Server Certificate=true;";
        }

        return connection;
    }

    public static void LoadDotEnv()
    {
        var searchDirs = new List<DirectoryInfo?>
        {
            new DirectoryInfo(Directory.GetCurrentDirectory()),
            new DirectoryInfo(AppContext.BaseDirectory)
        };

        foreach (var startDir in searchDirs)
        {
            var current = startDir;
            while (current != null)
            {
                var envPath = Path.Combine(current.FullName, ".env");
                if (File.Exists(envPath))
                {
                    ApplyEnvFile(envPath);
                    return;
                }

                var repoEnv = Path.Combine(current.FullName, "repo", "MedLib-URP", ".env");
                if (File.Exists(repoEnv))
                {
                    ApplyEnvFile(repoEnv);
                    return;
                }

                current = current.Parent;
            }
        }
    }

    private static void ApplyEnvFile(string path)
    {
        foreach (var line in File.ReadAllLines(path))
        {
            var trimmed = line.Trim();
            if (string.IsNullOrWhiteSpace(trimmed) || trimmed.StartsWith("#")) continue;
            var parts = trimmed.Split('=', 2);
            if (parts.Length == 2)
            {
                var key = parts[0].Trim();
                var val = parts[1].Trim().Trim('"', '\'');
                Environment.SetEnvironmentVariable(key, val);
            }
        }
    }
}
