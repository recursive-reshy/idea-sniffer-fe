import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import path from 'path'

// https://vite.dev/config/
export default defineConfig( {
  plugins: [
    react(),
    babel( { presets: [ reactCompilerPreset() ] } )
  ],
  resolve: {
    alias: {
      '@api': path.resolve( __dirname, 'src/api' ),
      '@assets': path.resolve( __dirname, 'src/assets' ),
      '@components': path.resolve( __dirname, 'src/components' ),
      '@pages': path.resolve( __dirname, 'src/pages' ),
      '@store': path.resolve( __dirname, 'src/store' ),
      '@theme': path.resolve( __dirname, 'src/theme' ),
      '@types': path.resolve( __dirname, 'src/types' ),
      '@': path.resolve( __dirname, 'src' )
    }
  }
} )
