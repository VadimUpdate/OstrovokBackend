package com.study.projectstudy.service

import com.study.projectstudy.entity.User
import com.study.projectstudy.repository.UserRepository
import com.study.projectstudy.repository.SettingRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val settingRepository: SettingRepository
) {

    fun register(username: String, password: String): Boolean {
        if (userRepository.findByUsername(username) != null) return false

        val encodedPassword = passwordEncoder.encode(password)

        // 👇 Пока временно: username 'admin' — получает роль ADMIN
        val role = if (username.lowercase() == "admin") "ROLE_ADMIN" else "ROLE_USER"
        val newUser = User(username = username, password = encodedPassword, role = role)

        userRepository.save(newUser)
        return true
    }

    fun authenticate(username: String, rawPassword: String): Boolean {
        val user = userRepository.findByUsername(username) ?: return false
        return passwordEncoder.matches(rawPassword, user.password)
    }

    fun getUserByUsername(username: String): User? {
        return userRepository.findByUsername(username)
    }
}
