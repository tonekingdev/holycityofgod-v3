import mysql from "mysql2/promise"

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "holycityofgod_dev",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  charset: "utf8mb4",
  timezone: "+00:00",
}

// Create connection pool for better performance
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  idleTimeout: 60000, // Correct option for idle connection timeout
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
})

// Database connection wrapper with error handling
export async function getConnection() {
  try {
    console.log("[Anointed Innovations] Attempting database connection to:", {
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      user: dbConfig.user,
    })
    return await pool.getConnection()
  } catch (error) {
    console.error("[Anointed Innovations] Database connection error:", error)
    if (error instanceof Error && "code" in error && error.code === "ETIMEDOUT") {
      throw new Error(
        `Database connection timeout. Check if database server at ${dbConfig.host}:${dbConfig.port} is accessible.`,
      )
    }
    throw new Error("Failed to connect to database")
  }
}

// Execute query with automatic connection management
export async function executeQuery<T = Record<string, unknown>>(query: string, params: unknown[] = []): Promise<T[]> {
  const connection = await getConnection()
  try {
    console.log("[Anointed Innovations] Executing query:", query.substring(0, 100) + "...")
    const [rows] = await connection.execute(query, params)
    return rows as T[]
  } catch (error) {
    console.error("[Anointed Innovations] Query execution error:", error)
    throw error
  } finally {
    connection.release()
  }
}

// Execute transaction with rollback support
export async function executeTransaction(queries: Array<{ query: string; params?: unknown[] }>) {
  const connection = await getConnection()
  try {
    await connection.beginTransaction()

    const results = []
    for (const { query, params = [] } of queries) {
      console.log("[Anointed Innovations] Transaction query:", query.substring(0, 100) + "...")
      const [result] = await connection.execute(query, params)
      results.push(result)
    }

    await connection.commit()
    return results
  } catch (error) {
    await connection.rollback()
    console.error("[Anointed Innovations] Transaction error:", error)
    throw error
  } finally {
    connection.release()
  }
}

// Health check function
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await executeQuery("SELECT 1 as health_check")
    return true
  } catch (error) {
    console.error("[Anointed Innovations] Database health check failed:", error)
    return false
  }
}

// Close all connections (for graceful shutdown)
export async function closeDatabaseConnections() {
  try {
    await pool.end()
    console.log("[Anointed Innovations] Database connections closed")
  } catch (error) {
    console.error("[Anointed Innovations] Error closing database connections:", error)
  }
}