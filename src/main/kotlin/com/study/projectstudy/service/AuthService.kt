package com.study.projectstudy.service

import com.study.projectstudy.entity.User
import com.study.projectstudy.repository.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
) {

    fun register(username: String, password: String): Boolean {
        if (userRepository.findByUsername(username) != null) {
            return false // пользователь уже существует
        }

        val encodedPassword = passwordEncoder.encode(password)
        val newUser = User(username = username, password = encodedPassword)
        userRepository.save(newUser)
        return true
    }

    fun authenticate(username: String, password: String): Boolean {
        val user = userRepository.findByUsername(username) ?: return false
        return passwordEncoder.matches(password, user.password)
    }
}
