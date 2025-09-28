package com.study.backend.service

import com.study.backend.entity.Role
import com.study.backend.repository.RoleRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class RoleService(private val roleRepository: RoleRepository) {

    fun getAllRoles(): List<Role> = roleRepository.findAll()

    fun getRoleById(id: Long): Role =
        roleRepository.findById(id).orElseThrow { RuntimeException("Role not found with id: $id") }

    @Transactional
    fun createRole(role: Role): Role {
        if (roleRepository.findByName(role.name) != null) {
            throw RuntimeException("Role with name '${role.name}' already exists")
        }
        return roleRepository.save(role)
    }

    @Transactional
    fun updateRole(id: Long, updatedRole: Role): Role {
        val existingRole = getRoleById(id)
        if (roleRepository.findByName(updatedRole.name) != null && updatedRole.name != existingRole.name) {
            throw RuntimeException("Role with name '${updatedRole.name}' already exists")
        }
        return roleRepository.save(existingRole.copy(name = updatedRole.name))
    }

    @Transactional
    fun deleteRole(id: Long) {
        val role = getRoleById(id)
        roleRepository.delete(role)
    }
}
