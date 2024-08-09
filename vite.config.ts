import {defineConfig,loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";
import libCss from 'vite-plugin-libcss'
import svgr from "vite-plugin-svgr";
// https://vitejs.dev/config/
export default defineConfig(({mode})=>{
  const env=loadEnv(mode,process.cwd(),'');
  return {
    plugins: [react(), libCss(),svgr({
      include:"**/*/*/*.svg?react",
    })],
    css: {
      preprocessorOptions:{
        less: {
          math:"always",
        }
      }
    },
    resolve: {
      alias: {
        "@": path.join(__dirname, "src"),
      },
    },
    build: {
      rollupOptions: {
        external: [],
        output: {
          globals: {
            'react': 'React',
          },
          sourcemap: false,
        },
        input:{
          index:'index.html',
        }
      },
      cssCodeSplit: true,
    }
  }
})
