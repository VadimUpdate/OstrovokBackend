package com.study.backend.controller

import com.study.backend.entity.Role
import com.study.backend.service.RoleService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/roles")
class RoleController(private val roleService: RoleService) {

    @GetMapping
    fun getAll(): List<Role> = roleService.getAllRoles()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): Role = roleService.getRoleById(id)

    @PostMapping
    fun create(@RequestBody role: Role): Role = roleService.createRole(role)

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @RequestBody updatedRole: Role): Role =
        roleService.updateRole(id, updatedRole)

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long) {
        roleService.deleteRole(id)
    }
}
