package com.study.backend.service

import com.study.backend.entity.User
import com.study.backend.repository.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
) {

    fun register(username: String, password: String): Boolean {
        if (userRepository.findByUsername(username) != null) return false

        val encodedPassword = passwordEncoder.encode(password)


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
