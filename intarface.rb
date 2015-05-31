require 'bundler/setup'
require 'erb'
require 'codebreaker'

class GameInterface

  def call(env)
    @request = Rack::Request.new(env)
    start nil
    case @request.path
      when "/hint"
        hint
      when "/comparison"
        comparison
      when "/"
        start 'new game'
        index
      when "/get_code"
        get_code
      when "/attempt"
        get_attempt
      else
        Rack::Response.new("Not Found", 404)
    end
  end

  def get_code
    Rack::Response.new(@game.code)
  end

  def ol
    
  end

  def get_attempt
    Rack::Response.new(@game.inspect)
  end

  def index
    Rack::Response.new(render("index.html.erb"))
  end

  def hint
    Rack::Response.new(@game.get_hint)
  end

  def comparison
    res = @game.comparison @request.params['val']
    @game = nil if res == 'Game over'
    Rack::Response.new(res)
  end

  def render(template)
    path = File.expand_path("public/views/#{template}")
    ERB.new(File.read(path)).result(binding)
  end

  def start arg
    @game = Codebreaker::Game.new if arg
    @game ||= Codebreaker::Game.new
  end

end



