def bad_deserialization
    o = Klass.new("hello\n")
    data = params['data']
    obj = Marshal.load(data)

    o = Klass.new("hello\n")
    data = YAML.dump(o)
    obj = YAML.load(data)

    o = Klass.new(params['hello'])
    data = CSV.dump(o)
    obj = CSV.load(data)

    o = Klass.new("helloo\n")
    data = cookies['some_fields']
    obj = Oj.object_load(data)
    obj = Oj.load(data)
   obj = Oj.load(data,options=some_safe_options)
 end

 def ok_deserialization
    o = Klass.new("hello\n")
    data = YAML.dump(o)
    obj = YAML.load(data, safe: true)

    filename = File.read("test.txt")
    data = YAML.dump(filename)
    YAML.load(filename)

    YAML.load(File.read("test.txt"))
 end
