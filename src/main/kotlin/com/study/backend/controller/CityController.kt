package com.study.backend.controller

import com.study.backend.entity.City
import com.study.backend.service.CityService
import org.springframework.web.bind.annotation.*
import org.springframework.http.ResponseEntity
import java.net.URI

@RestController
@RequestMapping("/api/cities")
class CityController(private val service: CityService) {

    @GetMapping
    fun getAll(): List<City> = service.getAll()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): City = service.getById(id)

    @PostMapping
    fun create(@RequestBody city: City): ResponseEntity<City> {
        val saved = service.create(city)
        return ResponseEntity.created(URI.create("/api/cities/${saved.id}")).body(saved)
    }

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @RequestBody city: City): City = service.update(id, city)

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Unit> {
        service.delete(id)
        return ResponseEntity.noContent().build()
    }
}
