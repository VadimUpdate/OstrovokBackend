package com.study.projectstudy.dto

/**
 * DTO для входящего тела запроса регистрации и логина.
 * Содержит только имя пользователя и пароль.
 */
data class AuthRequest(
    val username: String,
    val password: String
)
