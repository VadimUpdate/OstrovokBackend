package com.study.backend.controller

import com.study.backend.entity.User
import com.study.backend.service.UserService
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/users")
class UserController(
    private val userService: UserService,
    private val passwordEncoder: PasswordEncoder
) {

    @GetMapping
    fun getAll(): List<User> = userService.getAllUsers()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): User = userService.getUserById(id)

    @PostMapping
    fun create(@RequestBody user: User): User =
        userService.createUser(user, passwordEncoder)

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @RequestBody updatedUser: User): User =
        userService.updateUser(id, updatedUser)

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long) {
        userService.deleteUser(id)
    }
}
