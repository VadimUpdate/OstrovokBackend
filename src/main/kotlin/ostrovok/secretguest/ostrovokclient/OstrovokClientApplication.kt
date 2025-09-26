package ostrovok.secretguest.ostrovokclient

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class OstrovokClientApplication

fun main(args: Array<String>) {
    runApplication<OstrovokClientApplication>(*args)
}
