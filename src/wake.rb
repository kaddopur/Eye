watch('.*\.coffee') {|md| system("coffee -bc -o ..\\js #{md[0]}")}
watch('.*\.jade')   {|md| system("jade -P -O .. #{md[0]}")}
watch('.*\.styl')   {|md| system("stylus -o ..\\css #{md[0]}")}

