require 'bundler/setup'
require 'erb'
require 'codebreaker'

class GameInterface

  def call(env)
    @request = Rack::Request.new(env)
    start
    case @request.path
      when "/hint"
        hint
      when "/comparison"
        comparison
      when "/"
        index
      else
        Rack::Response.new("Not Found", 404)
    end
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

  def start
    @game ||= Codebreaker::Game.new
  end

end



