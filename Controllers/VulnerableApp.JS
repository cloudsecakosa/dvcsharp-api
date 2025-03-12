using System;
using System.Data.SqlClient;
using System.Security.Cryptography;
using System.Text;

namespace VulnerableApp
{
    class Program
    {
        // Hardcoded API Key (Vulnerability)
        private static string apiKey = "my-super-secret-api-key";

        static void Main(string[] args)
        {
            Console.WriteLine("Enter username:");
            string username = Console.ReadLine();

            Console.WriteLine("Enter password:");
            string password = Console.ReadLine();

            // 1️⃣ SQL Injection Vulnerability (Directly embedding user input in SQL query)
            string connectionString = "Server=myServer;Database=myDB;User Id=myUser;Password=myPass;";
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                string query = "SELECT * FROM Users WHERE Username = '" + username + "' AND Password = '" + password + "'";
                SqlCommand command = new SqlCommand(query, connection);
                SqlDataReader reader = command.ExecuteReader();

                if (reader.HasRows)
                {
                    Console.WriteLine("Login successful!");
                }
                else
                {
                    Console.WriteLine("Invalid credentials.");
                }
            }

            // 2️⃣ Insecure Cryptography (MD5 - Weak Hashing Algorithm)
            Console.WriteLine("Enter a string to hash:");
            string input = Console.ReadLine();
            string hashedValue = GetMd5Hash(input);
            Console.WriteLine($"Insecure MD5 Hash: {hashedValue}");

            // 3️⃣ Unvalidated Input (Executing user input directly)
            Console.WriteLine("Enter command:");
            string userCommand = Console.ReadLine();
            ExecuteCommand(userCommand);
        }

        // Insecure MD5 Hashing
        static string GetMd5Hash(string input)
        {
            using (MD5 md5 = MD5.Create())
            {
                byte[] data = md5.ComputeHash(Encoding.UTF8.GetBytes(input));
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < data.Length; i++)
                {
                    sb.Append(data[i].ToString("x2"));
                }
                return sb.ToString();
            }
        }

        // Unvalidated input execution (Potential Remote Code Execution)
        static void ExecuteCommand(string command)
        {
            System.Diagnostics.Process.Start("cmd.exe", "/C " + command);
        }
    }
}
