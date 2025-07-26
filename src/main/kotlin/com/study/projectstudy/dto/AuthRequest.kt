package com.study.projectstudy.dto

/**
 * DTO для входящего тела запроса регистрации и логина.
 * Содержит только имя пользователя и пароль.
 */
data class AuthRequest(
    val username: String,
    val password: String
)
data class SettingUpdateRequest(
    val section: String,  // Раздел, в котором находится настройка
    val newValue: String  // Новое значение
)