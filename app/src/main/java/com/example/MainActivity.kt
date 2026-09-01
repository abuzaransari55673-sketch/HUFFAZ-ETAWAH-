package com.example

import android.annotation.SuppressLint
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.ViewGroup
import android.webkit.GeolocationPermissions
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.viewinterop.AndroidView
import com.example.ui.theme.MyApplicationTheme

class MainActivity : ComponentActivity() {

  private var webView: WebView? = null

  @SuppressLint("SetJavaScriptEnabled")
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    enableEdgeToEdge()

    onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
      override fun handleOnBackPressed() {
        if (webView?.canGoBack() == true) {
          webView?.goBack()
        } else {
          isEnabled = false
          onBackPressedDispatcher.onBackPressed()
        }
      }
    })

    setContent {
      MyApplicationTheme {
        Box(
          modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF0B4632))
            .statusBarsPadding()
        ) {
          AppWebView(
            onWebViewCreated = { wv ->
              webView = wv
            }
          )
        }
      }
    }
  }

  override fun onDestroy() {
    webView?.destroy()
    webView = null
    super.onDestroy()
  }
}

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun AppWebView(
  modifier: Modifier = Modifier,
  onWebViewCreated: (WebView) -> Unit = {}
) {
  val context = LocalContext.current

  AndroidView(
    modifier = modifier.fillMaxSize(),
    factory = { ctx ->
      WebView(ctx).apply {
        layoutParams = ViewGroup.LayoutParams(
          ViewGroup.LayoutParams.MATCH_PARENT,
          ViewGroup.LayoutParams.MATCH_PARENT
        )

        settings.apply {
          javaScriptEnabled = true
          domStorageEnabled = true
          databaseEnabled = true
          allowFileAccess = true
          allowContentAccess = true
          allowFileAccessFromFileURLs = true
          allowUniversalAccessFromFileURLs = true
          loadWithOverviewMode = true
          useWideViewPort = true
          setSupportZoom(true)
          builtInZoomControls = false
          displayZoomControls = false
          mediaPlaybackRequiresUserGesture = false
          mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
          cacheMode = WebSettings.LOAD_DEFAULT
        }

        webChromeClient = object : WebChromeClient() {
          override fun onGeolocationPermissionsShowPrompt(
            origin: String?,
            callback: GeolocationPermissions.Callback?
          ) {
            callback?.invoke(origin, true, false)
          }
        }

        webViewClient = object : WebViewClient() {
          override fun shouldOverrideUrlLoading(
            view: WebView?,
            request: WebResourceRequest?
          ): Boolean {
            val url = request?.url?.toString() ?: return false
            // Do not override sub-frame requests (e.g. YouTube iframe embeds)
            if (request?.isForMainFrame == false) {
              return false
            }
            if (url.startsWith("file:///android_asset/") || url.startsWith("http://localhost") || url.startsWith("about:blank")) {
              return false
            }
            return try {
              val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
              ctx.startActivity(intent)
              true
            } catch (e: Exception) {
              false
            }
          }
        }

        loadUrl("file:///android_asset/index.html")
        onWebViewCreated(this)
      }
    }
  )
}

