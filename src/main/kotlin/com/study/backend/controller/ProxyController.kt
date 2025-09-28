package com.study.backend.controller

import jakarta.servlet.http.HttpServletRequest
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.*
import org.springframework.web.bind.annotation.*
import org.springframework.web.client.RestTemplate
import java.util.Collections
import org.springframework.http.HttpMethod

@RestController
@RequestMapping("/proxy")
class ProxyController(private val restTemplate: RestTemplate) {

    private val backendUrl = "http://admin-backend:8000"

    @RequestMapping("/**")
    fun proxy(request: HttpServletRequest, @RequestBody(required = false) body: String?): ResponseEntity<String> {
        val path = request.requestURI.substring("/proxy".length)
        val url = backendUrl + path + if (request.queryString != null) "?" + request.queryString else ""

        val headers = HttpHeaders()
        Collections.list(request.headerNames).forEach { headerName ->
            if (headerName.equals("host", ignoreCase = true)) return@forEach
            headers.addAll(headerName, Collections.list(request.getHeaders(headerName)))
        }

        // Добавляем авторизационный заголовок, если он есть
        val authHeader = request.getHeader("Authorization")
        if (authHeader != null) {
            headers.set("Authorization", authHeader)
        }

        val httpMethod = try {
            HttpMethod.valueOf(request.method)
        } catch (ex: IllegalArgumentException) {
            HttpMethod.GET
        }

        val entity = HttpEntity(body, headers)

        // Отправка запроса на бэкенд
        val response = restTemplate.exchange(url, httpMethod, entity, String::class.java)

        // Заголовки для ответа
        val responseHeaders = HttpHeaders()
        response.headers.forEach { (key, values) -> responseHeaders.put(key, values) }

        // Обработка CORS в ответе
        responseHeaders.add("Access-Control-Allow-Origin", "*")
        responseHeaders.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        responseHeaders.add("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin, Accept")
        responseHeaders.add("Access-Control-Allow-Credentials", "true")

        return ResponseEntity(response.body, responseHeaders, response.statusCode)
    }
}

@Configuration
class RestTemplateConfig {
    @Bean
    fun restTemplate(): RestTemplate = RestTemplate()
}
