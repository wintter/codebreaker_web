require "gem_codebreaker_rack/version"
require 'bundler/setup'
require 'erb'
require 'codebreaker'
require 'json'

module GemCodebreakerRack
  
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
        when "/info"
          info
        when "/save_result"
          save_result
        when "/logout"
          logout_user
        when "/load_result"
          load_result
        when "/add_session"
          add_session
        else
          Rack::Response.new("Not Found", 404)
      end
    end

    def save_result
      return [] unless @request.session[:username]
      user = {
          "username" => @request.session[:username],
          "attempt" => 5 - @game.attempt,
          "time" => Time.now.strftime("%Y-%m-%d %H:%M:%S")
      }
      dump = JSON.generate(JSON.parse(File.read("public/result/result.json")) << user)
      File.open("public/result/result.json","w") {|f|  f.write(dump)}
      Rack::Response.new("All good", 200)
    end

    def load_result
      r_data = String.new
      data = File.readlines("public/result/result.json").each {|line| r_data << line}
      Rack::Response.new(data)
    end

    def add_session
      @request.session[:username] = @request.params['username']
      Rack::Response.new("All good", 200)
    end

    def logout_user
      @request.session[:username] = nil
      Rack::Response.new {|response| response.redirect("/")}
    end

    def info
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
      Rack::Response.new(res)
    end

    def render(template)
      path = File.expand_path("public/views/#{template}")
      ERB.new(File.read(path)).result(binding)
    end

    def start arg
      return @game = ::Codebreaker::Game.new if arg
      @game ||= ::Codebreaker::Game.new
    end

  end
end
