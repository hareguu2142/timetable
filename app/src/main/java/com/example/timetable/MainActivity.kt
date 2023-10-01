package com.example.timetable

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import com.example.timetable.ui.theme.TimetableTheme
import android.content.Context
import android.content.pm.PackageManager
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper
import android.os.Environment
import android.widget.Toast
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import java.util.Calendar
import org.json.JSONArray
import java.io.File
import android.Manifest
class MainActivity : AppCompatActivity() {

    fun readJsonFromAssets(fileName: String): String {
        val assetManager = assets
        val inputStream = assetManager.open(fileName)
        val size = inputStream.available()
        val buffer = ByteArray(size)
        inputStream.read(buffer)
        inputStream.close()
        return String(buffer, Charsets.UTF_8)
    }

    fun getCurrentPeriod(): Int {
        val calendar = Calendar.getInstance()
        val hour = calendar.get(Calendar.HOUR_OF_DAY)
        val minute = calendar.get(Calendar.MINUTE)

        return when {
            hour == 8 && minute >= 20 || hour == 9 && minute < 20 -> 1
            hour == 9 && minute >= 20 || hour == 10 && minute < 20 -> 2
            hour == 10 && minute >= 20 || hour == 11 && minute < 20 -> 3
            hour == 11 && minute >= 20 || hour == 12 && minute < 20 -> 4
            hour == 13 && minute < 60 || hour == 14 && minute == 0 -> 5
            hour == 14 && minute < 60 || hour == 15 && minute == 0 -> 6
            hour == 15 && minute < 60 || hour == 16 && minute == 0 -> 7
            hour == 16 && minute < 60 || hour == 17 && minute < 10 -> 8
            hour == 17 && minute < 60 || hour == 18 && minute < 10 -> 9
            else -> -1
        }
    }

    data class LessonInfo(val period: Int, val lesson: String)

    fun getCurrentLessonFromJSON(): LessonInfo {
        val currentPeriod = getCurrentPeriod()
        val jsonData = readJsonFromAssets("timetable.json")
        val jsonArray = JSONArray(jsonData)
        var lesson = "No lesson"

        for (i in 0 until jsonArray.length()) {
            val jsonObject = jsonArray.getJSONObject(i)
            if (jsonObject.getInt("교시") == currentPeriod) {
                lesson = jsonObject.getString("수업")
                break
            }
        }

        return LessonInfo(currentPeriod, lesson)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.READ_EXTERNAL_STORAGE), 1)
        }

        val showLessonButton: Button = findViewById(R.id.showLessonButton)
        showLessonButton.setOnClickListener {
            val lessonInfo = getCurrentLessonFromJSON()
            Toast.makeText(this, "현재 교시: ${lessonInfo.period}, 수업: ${lessonInfo.lesson}", Toast.LENGTH_LONG).show()
        }
    }
}