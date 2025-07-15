import org.springframework.stereotype.Service
import java.io.File

@Service
class GitService(
    private val repoPath: String = "configs" // путь к локальному клону репозитория
) {

    fun commitAndPushFile(filename: String, content: String, commitMessage: String) {
        val file = File("$repoPath/$filename")
        file.writeText(content)

        execGit("add", filename)
        execGit("commit", "-m", commitMessage)
        execGit("push")
    }

    private fun execGit(vararg args: String) {
        val processBuilder = ProcessBuilder("git", *args)
            .directory(File(repoPath))
            .redirectErrorStream(true)
            .start()

        val result = processBuilder.inputStream.bufferedReader().readText()
        val exitCode = processBuilder.waitFor()
        if (exitCode != 0) {
            throw RuntimeException("Git command failed: git ${args.joinToString(" ")}\nResult: $result")
        }
    }
}
