coffee -bw -c -o ../js . &
jade -w -P -O .. *.jade &
#stylus -w -o ../css . &
sass --watch popup.scss:../css/popup.css viewer.scss:../css/viewer.css options.scss:../css/options.css &
