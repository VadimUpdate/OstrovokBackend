package com.study.backend.controller

import com.study.backend.entity.ProfileStatus
import com.study.backend.service.ProfileStatusService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/profile-status")
class ProfileStatusController(private val service: ProfileStatusService) {

    @GetMapping
    fun getAll(): List<ProfileStatus> = service.getAll()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): ProfileStatus = service.getById(id)

    @PostMapping
    fun create(@RequestBody profileStatus: ProfileStatus): ProfileStatus = service.create(profileStatus)

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @RequestBody updated: ProfileStatus): ProfileStatus =
        service.update(id, updated)

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long) = service.delete(id)
}