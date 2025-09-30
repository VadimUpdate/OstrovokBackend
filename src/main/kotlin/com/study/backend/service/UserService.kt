package com.study.backend.service

import com.study.backend.entity.User
import com.study.backend.repository.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class UserService(private val userRepository: UserRepository) {

    fun getAllUsers(): List<User> = userRepository.findAll()

    fun getUserById(id: Long): User =
        userRepository.findById(id).orElseThrow { RuntimeException("User not found with id: $id") }

    @Transactional
    fun createUser(user: User, passwordEncoder: PasswordEncoder): User {
        if (userRepository.findByUsername(user.username) != null) {
            throw RuntimeException("Username already exists")
        }

        val email = user.email
        if (email != null && userRepository.findAll().any { it.email == email }) {
            throw RuntimeException("Email already exists")
        }

        // Хешируем пароль
        user.password = passwordEncoder.encode(user.password)

        return userRepository.save(user)
    }

    @Transactional
    fun updateUser(id: Long, updatedUser: User): User {
        val existingUser = getUserById(id)

        existingUser.username = updatedUser.username
        //existingUser.password = updatedUser.password
        val email = updatedUser.email
        existingUser.email = email
        if (email != null && userRepository.findAll().any { it.email == email && it.id != id }) {
            throw RuntimeException("Email already exists")
        }

        existingUser.role = updatedUser.role
        existingUser.updatedAt = LocalDateTime.now()

        return userRepository.save(existingUser)
    }

    @Transactional
    fun deleteUser(id: Long) {
        val user = getUserById(id)
        userRepository.delete(user)
    }
}
