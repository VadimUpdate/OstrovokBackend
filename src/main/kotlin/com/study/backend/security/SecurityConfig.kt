package com.study.backend.security

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.authentication.dao.DaoAuthenticationProvider
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
@EnableWebSecurity
class SecurityConfig(
    private val jwtAuthFilter: JwtAuthFilter,
    private val userDetailsService: UserDetailsService
) {

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() }
            .cors { it.configurationSource(corsConfigurationSource()) }
            .authorizeHttpRequests {
                it
                    .requestMatchers("/error").permitAll() // ошибки Spring
                    .requestMatchers("/health/**").permitAll()
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                    .requestMatchers("/api/auth/**").permitAll()
                    .requestMatchers("/api/hotels/**").permitAll() // все методы для отелей
                    .requestMatchers("/api/users/**").permitAll()
                    .requestMatchers("/api/profiles/**").permitAll()
                    .requestMatchers( "/api/cities/**").permitAll()
                    .requestMatchers("/api/roles/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.GET, "/api/hotel-inspections/**").authenticated()
                    .requestMatchers("/api/hotel-inspections/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.GET, "/api/inspection-reasons/**").authenticated()
                    .requestMatchers("/api/inspection-reasons/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.GET, "/api/profile-status/**").authenticated()
                    .requestMatchers("/api/profile-status/**").hasRole("ADMIN")
                    .requestMatchers( "/api/report-media/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/inspection-reports/**").authenticated()
                    .requestMatchers(HttpMethod.POST, "/api/inspection-reports/**").hasAnyRole("USER","ADMIN")
                    .requestMatchers("/api/guest-requests/**").permitAll()
                    .requestMatchers(HttpMethod.PUT, "/api/inspection-reports/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/api/inspection-reports/**").hasRole("ADMIN")
                    .anyRequest().authenticated()
            }
            .sessionManagement {
                it.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            }
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter::class.java)

        return http.build()
    }

    @Bean
    fun authenticationProvider(): AuthenticationProvider {
        val provider = DaoAuthenticationProvider()
        provider.setUserDetailsService(userDetailsService)
        provider.setPasswordEncoder(passwordEncoder())
        return provider
    }

    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration()
        configuration.allowedOrigins = listOf("http://localhost:3000", "http://localhost:8080", "http://localhost:8081")
        configuration.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")
        configuration.allowedHeaders = listOf("*")
        configuration.allowCredentials = true
        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration)
        return source
    }
}
