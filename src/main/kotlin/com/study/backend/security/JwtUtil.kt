package com.study.backend.security

import io.jsonwebtoken.*
import io.jsonwebtoken.security.Keys
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.util.*
import javax.crypto.SecretKey

@Component
class JwtUtil {

    private val jwtSecret: SecretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256)
    private val jwtExpirationMs = 86400000L // 1 day expiration time
    private val logger = LoggerFactory.getLogger(JwtUtil::class.java) // Логгер для классов

    // Генерация токена
    fun generateToken(username: String, role: String): String {
        logger.info("Generating token for username: $username with role: $role")

        val now = Date()
        val expiryDate = Date(now.time + jwtExpirationMs)

        val token = Jwts.builder()
            .setSubject(username)
            .claim("role", role)  // Пишем роль как есть, если она передается с префиксом "ROLE_"
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(jwtSecret)
            .compact()

        logger.info("Token generated successfully. Expiry date: $expiryDate")
        return token
    }

    // Валидация токена
    fun validateToken(token: String): Boolean {
        logger.info("Validating token...")

        return try {
            val claims = Jwts.parserBuilder()
                .setSigningKey(jwtSecret)
                .build()
                .parseClaimsJws(token) // это проверяет, валиден ли токен

            val isValid = claims.body.expiration?.after(Date()) ?: false
            if (isValid) {
                logger.info("Token is valid. Expiry date: ${claims.body.expiration}")
            } else {
                logger.warn("Token is expired. Expiry date: ${claims.body.expiration}")
            }
            isValid
        } catch (ex: JwtException) {
            logger.error("Token validation failed: ${ex.message}")
            false
        }
    }

    // Извлечение имени пользователя из токена
    fun getUsernameFromToken(token: String): String {
        logger.info("Extracting username from token...")

        return try {
            val claims = Jwts.parserBuilder()
                .setSigningKey(jwtSecret)
                .build()
                .parseClaimsJws(token)
                .body

            val username = claims.subject
            logger.info("Username extracted: $username")
            username
        } catch (ex: JwtException) {
            logger.error("Failed to extract username from token: ${ex.message}")
            throw IllegalArgumentException("Invalid token")
        }
    }

    // Извлечение роли из токена
    fun getRoleFromToken(token: String): String? {
        logger.info("Extracting role from token...")

        return try {
            val claims = Jwts.parserBuilder()
                .setSigningKey(jwtSecret)
                .build()
                .parseClaimsJws(token)
                .body

            val role = claims["role"] as String?
            logger.info("Role extracted: $role")
            role
        } catch (ex: JwtException) {
            logger.error("Failed to extract role from token: ${ex.message}")
            null
        }
    }
}
