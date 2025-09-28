package ostrovok.secretguest.entity

import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "roles")
data class Role(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID = UUID.randomUUID(),

    @Column(nullable = false, unique = true)
    val name: String
)