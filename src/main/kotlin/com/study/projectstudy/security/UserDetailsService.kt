package com.study.projectstudy.security

import com.study.projectstudy.entity.User
import com.study.projectstudy.repository.UserRepository
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class CustomUserDetailsService(
    private val userRepository: UserRepository
) : UserDetailsService {

    override fun loadUserByUsername(username: String): UserDetails {
        // Находим пользователя по имени
        val user: User = userRepository.findByUsername(username)
            ?: throw UsernameNotFoundException("User '$username' not found")

        // Получаем роль из базы данных
        val role = getUserRole(username)

        // Возвращаем CustomUserDetails с ролью
        return CustomUserDetails(user, role)
    }

    fun getUserRole(username: String): String {
        // Получаем роль пользователя
        val user: User = userRepository.findByUsername(username)
            ?: throw UsernameNotFoundException("User '$username' not found")

        return user.role // Предполагается, что у User есть поле role типа String
    }
}
