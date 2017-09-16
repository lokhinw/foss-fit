#include <stdio.h>
#include <vector>
#include <string>
#include <math.h>
#include <string.h>

#define FOCUS_MULTIPLIER 2.5
#define FATIGUE_RUST 0.00001
#define FATIGUE_MULT 0.08

struct gym
{
    std::string location, name;
    std::vector<int> equipment;

    gym(std::string l, std::string n, std::vector<int> e)
    {
        location = l;
        name = n;
        equipment = e;
    }
};
struct exercise
{
    std::string name, desc;
    int id, level, sec_per_rep;
    std::vector<int> equipment, body_parts;

    exercise(int i, std::string n, std::string d, std::vector<int> e, std::vector<int> b, int l, int t)
    {
        id = i; name = n; desc = d; equipment = e; body_parts = b; level = l; sec_per_rep = t;
    }
};
struct preferences
{
    //second min stands for minutes
    int min_min, max_min, pref_min;
    int intensity;
    std::vector<int> focus;
};
struct block
{
    int exercise_id, sets, reps;
    //double rel_intensity;

    block() {}
    block(int e, int s, int r)
    {
        exercise_id = e; sets = s; reps = r;
    }
};
std::vector<gym> gyms;
std::vector<exercise> exercises;
int num_types_equipment, num_body_parts;
std::vector<bool> equipment_is_machine; // for short workouts, machines are inconvenient and thus undesirable
preferences p;
const int standard_rep_counts[] = {8, 10, 12, 15};
const int num_std_rep_counts = 4;
const int standard_time_counts[] = {15, 20, 30, 40, 45, 60, 120, 150, 180};
const int num_std_time_counts = 9;

int get_data();
int get_input();
int generate_workout();

int main(int argc, const char* argv[])
{
    get_data();

    get_input();

    generate_workout();

    return 0;
}

/* algorithm:
 * 1. assign each body part an intended fatigue level based on preferences
 * 2. select blocks of exercises, such that:
 *    a) every body part worked in an exercise gains fatigue
 *    b) when a body part isn't being used, it loses fatigue at a much slower rate
 *    c) the block of exercise is not inconvenient but lowers the stddev from the intended fatigue
 */
int generate_workout()
{
    //assign intended intensity levels based on user input
    double intended_fatigue[num_body_parts];
    const double _it_ftg = num_body_parts * p.intensity; //intended total intensity
    const double _ut_ftg = (p.focus.size()*FOCUS_MULTIPLIER + (num_body_parts - p.focus.size())) * p.intensity;//unweighted total intensity
    const double _g_ftg_m = _it_ftg / _ut_ftg;//global intensity multiplier
    for (int i = 0; i < num_body_parts; ++i)
        intended_fatigue[i] = p.intensity * _g_ftg_m;
    for (int i = 0; i < p.focus.size(); ++i)
        intended_fatigue[p.focus[i]] = FOCUS_MULTIPLIER * p.intensity * _g_ftg_m;

    int seconds_left = p.pref_min * 60;
    int next_seconds_left;
    double current_fatigue[num_body_parts] = {0.0};
    double next_fatigue[num_body_parts];
    bool another_exercise = true;

    //select blocks of exercises
    while (another_exercise)
    {
        block best_choice;
        block cur_choice;
        double best_choice_dev = 10000000.0;
        double cur_choice_dev;
        for (int i = 0; i < exercises.size(); ++i)
        {
            next_seconds_left = seconds_left;
            memcpy(next_fatigue, current_fatigue, num_body_parts * sizeof(double));
            //record current block
            cur_choice = block(exercises[i].id,1,0);

            //simulate reps until desired number reached
            bool more_reps = true;
            for (int j = 0; more_reps; ++j)
            {
                //update current block
                ++cur_choice.reps;

                next_seconds_left -= exercises[i].sec_per_rep;

                for (int k = 0; k < num_body_parts; ++k)
                    next_fatigue[k] -= FATIGUE_RUST * exercises[i].sec_per_rep;
                for (int k = 0; k < exercises[i].body_parts.size(); ++k)
                {
                    next_fatigue[exercises[i].body_parts[k]] += FATIGUE_MULT*exercises[i].level;
                    if (next_fatigue[exercises[i].body_parts[k]] > intended_fatigue[exercises[i].body_parts[k]])
                        more_reps = false;
                }
            }
            //redo reps so they're more organized; this is ugly, but it works
            const static int reps_per_rep[] = {0,  0,  0,  0,  0,  8,  8,  8,  8, 10, 10,
                                                  10, 12, 12, 15, 15, 15,  8,  8, 10, 10,
                                                  10, 10, 12, 12, 12, 12, 15, 15, 15, 15};
            const static int sets_per_rep[] = {0,  0,  0,  0,  0,  1,  1,  1,  1,  1,  1,
                                                   1,  1,  1,  1,  1,  1,  2,  2,  2,  2,
                                                   2,  2,  2,  2,  2,  2,  2,  2,  2,  2};
            if (cur_choice.reps > 30)
                cur_choice = block(i, 2, 15);
            else
                cur_choice = block(i, sets_per_rep[cur_choice.reps], reps_per_rep[cur_choice.reps]);

            //reset counters due to redone calcs
            next_seconds_left = seconds_left;
            memcpy(next_fatigue, current_fatigue, num_body_parts * sizeof(double));

            for (int k = 0; k < num_body_parts; ++k)
                next_fatigue[k] -= FATIGUE_RUST * exercises[i].sec_per_rep * cur_choice.reps*cur_choice.sets;
            for (int k = 0; k < exercises[i].body_parts.size(); ++k)
                next_fatigue[exercises[i].body_parts[k]] += FATIGUE_MULT*exercises[i].level* cur_choice.reps*cur_choice.sets;

            //update time
            next_seconds_left -= cur_choice.reps*cur_choice.sets*exercises[i].sec_per_rep;

            //calculate standard deviation here
            //it's actually the sum of squares of deviations since the sqrt and divisions are all redundant
            cur_choice_dev = 0.0;
            for (int k = 0; k < num_body_parts; ++k)
                cur_choice_dev += pow(next_fatigue[k]-intended_fatigue[k],2.0);

            //if we've found a better block, then use that
            if (cur_choice_dev < best_choice_dev)
            {
                best_choice_dev = cur_choice_dev;
                memcpy(&best_choice, &cur_choice, sizeof(block)); //same thing as assign but was too lazy to overload that operator
            }
        }
    }

    printf("generate_workout not yet fully implemented!\n");
    return 0;
}

int get_data()
{
    printf("get_data not yet implemented!\n");
    return 0;
}

int get_input()
{
    printf("get_input not yet implemented!\n");
    return 0;
}
