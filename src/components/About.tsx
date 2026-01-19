
import { Calendar, Users, Trophy, Globe } from "phosphor-react";

const stats = [
  {
    icon: Calendar,
    value: "10+",
    label: "Years Experience"
  },
  {
    icon: Users,
    value: "500+",
    label: "Events Managed"
  },
  {
    icon: Trophy,
    value: "15+",
    label: "Industry Awards"
  },
  {
    icon: Globe,
    value: "3",
    label: "Continents"
  }
];

const About = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">About TPEC Events</h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          </div>
          
          <div className="prose prose-lg max-w-none text-foreground">
            <p>
              TPEC Events is a premier event consulting agency with a passion for creating exceptional, memorable experiences. With our international event management experience and diverse skill sets, we specialize in transforming visions into flawlessly executed events.
            </p>
            
            <p>
              Our team brings together expertise from across the events industry, offering comprehensive services for weddings, corporate functions, milestone celebrations, and special occasions. We understand that each event is unique, which is why we provide customized solutions tailored to our clients' specific needs and preferences.
            </p>
            
            <h3 className="text-xl font-bold mt-8 mb-4 text-foreground">Our Approach</h3>
            
            <p>
              At TPEC Events, we believe in a collaborative approach to event planning. We work closely with our clients to understand their vision, preferences, and requirements, ensuring that every detail reflects their unique style and objectives. Our process combines creative innovation with meticulous planning to deliver experiences that exceed expectations.
            </p>
            
            <p>
              We pride ourselves on our attention to detail, commitment to excellence, and ability to navigate challenges with professionalism and grace. Whether managing a corporate conference, coordinating a destination wedding, or organizing an intimate celebration, our team brings the same level of dedication and expertise to every project.
            </p>
            
            <h3 className="text-xl font-bold mt-8 mb-4 text-foreground">International Expertise</h3>
            
            <p>
              With experience spanning multiple continents, our team brings a global perspective to event planning. We have successfully managed events across various cultural contexts and locations, allowing us to offer unique insights and innovative solutions to our clients. Our international network of vendors and partners enables us to source the finest services and products for every event.
            </p>
            
            <h3 className="text-xl font-bold mt-8 mb-4 text-foreground">Our Commitment</h3>
            
            <p>
              TPEC Events is committed to creating meaningful, impactful experiences that leave lasting impressions. We understand the importance of the occasions we help plan and the trust our clients place in us. That's why we approach each event with integrity, creativity, and a steadfast dedication to bringing our clients' visions to life.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {stats.map((stat, index) => (
              <div key={index} className="tpec-card p-6 text-center">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
