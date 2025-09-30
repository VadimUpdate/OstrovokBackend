package com.study.backend.controller

import com.study.backend.dto.HotelRequest
import com.study.backend.entity.Hotel
import com.study.backend.service.HotelService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.net.URI
import java.util.*

@RestController
@RequestMapping("/api/hotels")
class HotelController(private val hotelService: HotelService) {

    @GetMapping
    fun list(): List<Hotel> = hotelService.getAll()

    @GetMapping("/{id}")
    fun get(@PathVariable id: UUID): Hotel = hotelService.getById(id)

    @PostMapping
    fun create(@RequestBody req: HotelRequest): ResponseEntity<Hotel> {
        val saved = hotelService.create(req)
        return ResponseEntity.created(URI.create("/api/hotels/${saved.id}")).body(saved)
    }

    @PutMapping("/{id}")
    fun update(@PathVariable id: UUID, @RequestBody req: HotelRequest): Hotel =
        hotelService.update(id, req)

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: UUID): ResponseEntity<Unit> {
        hotelService.delete(id)
        return ResponseEntity.noContent().build()
    }
}
