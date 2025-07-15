package com.study.projectstudy.dto

/**
 * DTO для ответа на запрос логина.
 * Содержит единственное поле — сгенерированный JWT-токен.
 */
data class AuthResponse(
    val token: String
)
