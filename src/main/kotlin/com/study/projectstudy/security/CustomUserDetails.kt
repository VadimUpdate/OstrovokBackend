package com.study.projectstudy.security

import com.study.projectstudy.entity.User
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import com.study.projectstudy.security.JwtUtil
import org.springframework.security.core.authority.SimpleGrantedAuthority

class CustomUserDetails(
    val user: User,        // Сохраняем информацию о пользователе
    private val role: String // Добавляем роль
) : UserDetails {

    override fun getAuthorities(): MutableCollection<out GrantedAuthority> {
        // Создаем список авторизаций, добавляя роль как 'ROLE_' префикс
        return mutableListOf(SimpleGrantedAuthority("ROLE_$role"))
    }

    override fun getPassword(): String = user.password

    override fun getUsername(): String = user.username

    override fun isAccountNonExpired(): Boolean = true

    override fun isAccountNonLocked(): Boolean = true

    override fun isCredentialsNonExpired(): Boolean = true

    override fun isEnabled(): Boolean = true
}
