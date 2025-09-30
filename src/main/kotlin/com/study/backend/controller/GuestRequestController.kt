package com.study.backend.controller

import com.study.backend.dto.GuestRequestDto
import com.study.backend.entity.GuestRequest
import com.study.backend.service.GuestRequestService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.net.URI
import java.util.*

@RestController
@RequestMapping("/api/guest-requests")
class GuestRequestController(private val service: GuestRequestService) {

    @GetMapping
    fun getAll(): List<GuestRequest> = service.getAll()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: UUID): GuestRequest = service.getById(id)

    @PostMapping
    fun create(@RequestBody dto: GuestRequestDto): ResponseEntity<GuestRequest> {
        val saved = service.create(dto)
        return ResponseEntity.created(URI.create("/api/guest-requests/${saved.id}")).body(saved)
    }

    @PutMapping("/{id}")
    fun update(@PathVariable id: UUID, @RequestBody dto: GuestRequestDto): GuestRequest =
        service.update(id, dto)

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: UUID): ResponseEntity<Unit> {
        service.delete(id)
        return ResponseEntity.noContent().build()
    }
}
