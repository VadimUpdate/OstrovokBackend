package com.study.backend.controller

import com.study.backend.dto.ProfileCreateRequest
import com.study.backend.dto.ProfileUpdateRequest
import com.study.backend.entity.Profile
import com.study.backend.service.ProfileService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import com.study.backend.service.HotelService

@RestController
@RequestMapping("/api/profiles")
class ProfileController(private val profileService: ProfileService) {

    @GetMapping
    fun list(): List<Profile> = profileService.getAll()

    @GetMapping("/{id}")
    fun get(@PathVariable id: Long): Profile = profileService.getById(id)

    @PostMapping
    fun create(@RequestBody req: ProfileCreateRequest): ResponseEntity<Profile> {
        val saved = profileService.create(req)
        return ResponseEntity.ok(saved)
    }

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @RequestBody req: ProfileUpdateRequest): Profile =
        profileService.update(id, req)

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Unit> {
        profileService.delete(id)
        return ResponseEntity.noContent().build()
    }
}
