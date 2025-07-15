package com.study.projectstudy.security

import io.jsonwebtoken.*
import io.jsonwebtoken.security.Keys
import org.springframework.stereotype.Component
import java.util.*
import javax.crypto.SecretKey

@Component
class JwtUtil {

    // Секретный ключ для подписи JWT токена
    private val jwtSecret: SecretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256)

    // Время жизни токена - 1 день
    private val jwtExpirationMs = 86400000

    // Генерация токена по имени пользователя
    fun generateToken(username: String): String {
        val now = Date()
        val expiryDate = Date(now.time + jwtExpirationMs)

        return Jwts.builder()
            .setSubject(username)        // Устанавливаем логин пользователя как subject
            .setIssuedAt(now)           // Время создания токена
            .setExpiration(expiryDate)  // Время истечения токена
            .signWith(jwtSecret)        // Подписываем токен секретным ключом
            .compact()                  // Преобразуем в строку
    }

    // Валидация токена (подпись + срок действия)
    fun validateToken(token: String): Boolean {
        return try {
            Jwts.parserBuilder()
                .setSigningKey(jwtSecret)         // Проверка подписи токена
                .build()
                .parseClaimsJws(token)            // Проверка структуры и даты
            true
        } catch (ex: JwtException) {
            false
        }
    }

    // Получение имени пользователя из токена
    fun getUsernameFromToken(token: String): String {
        val claims = Jwts.parserBuilder()
            .setSigningKey(jwtSecret)
            .build()
            .parseClaimsJws(token)
            .body

        return claims.subject
    }
}
