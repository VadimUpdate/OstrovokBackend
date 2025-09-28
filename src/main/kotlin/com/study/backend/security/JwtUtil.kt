package com.study.backend.security

import io.jsonwebtoken.*
import io.jsonwebtoken.security.Keys
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.util.*
import javax.crypto.SecretKey
import java.util.Base64

@Component
class JwtUtil(
    @Value("\${jwt.secret}") private val jwtSecretString: String
) {

    private val logger = LoggerFactory.getLogger(JwtUtil::class.java)

    // secret из properties, декодируем base64 в bytes
    private val jwtSecret: SecretKey by lazy {
        Keys.hmacShaKeyFor(Base64.getDecoder().decode(jwtSecretString))
    }

    private val accessTokenExpirationMs = 24 * 60 * 60 * 1000L // 1 day, при необходимости уменьшить

    fun generateToken(username: String, role: String): String {
        val now = Date()
        val expiryDate = Date(now.time + accessTokenExpirationMs)

        val token = Jwts.builder()
            .setSubject(username)
            .claim("role", role)
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(jwtSecret)
            .compact()

        logger.info("Generated token for $username exp=$expiryDate")
        return token
    }

    fun validateToken(token: String): Boolean {
        return try {
            val claims = Jwts.parserBuilder()
                .setSigningKey(jwtSecret)
                .build()
                .parseClaimsJws(token)
            val ok = claims.body.expiration?.after(Date()) ?: false
            logger.info("validateToken sub=${claims.body.subject} ok=$ok exp=${claims.body.expiration}")
            ok
        } catch (ex: ExpiredJwtException) {
            logger.warn("Token expired: ${ex.message}")
            false
        } catch (ex: JwtException) {
            logger.error("Invalid token: ${ex.message}")
            false
        }
    }

    fun getUsernameFromToken(token: String): String {
        val claims = Jwts.parserBuilder()
            .setSigningKey(jwtSecret)
            .build()
            .parseClaimsJws(token)
            .body
        return claims.subject
    }

    fun getRoleFromToken(token: String): String? {
        val claims = Jwts.parserBuilder()
            .setSigningKey(jwtSecret)
            .build()
            .parseClaimsJws(token)
            .body
        return claims["role"] as String?
    }
}
